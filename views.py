from django.shortcuts import render
from hotels.models import HotelStaff
from .serializers import HotelStaffSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from hotels.models import Hotels, HotelStaff
from guests.models import Guests, GuestDocument, Notifications
from guests.serializers import HotelSerializer3 , NotificationSerializer

from datetime import datetime
import requests
from django.db.models import F,Count, ExpressionWrapper, fields
from datetime import datetime, timedelta


# Create your views here.
class HotelStaffCreateView(generics.CreateAPIView):
    queryset = HotelStaff.objects.all()
    serializer_class = HotelStaffSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'status': 'success',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )
class HotelStaffAPIView(APIView):
    def get(self, request, format=None):
        hotel_user_name = request.query_params.get('hotel_user_name', None)
        if hotel_user_name is not None:
            staff = HotelStaff.objects.filter(hotel_user_name=hotel_user_name).select_related('hotel')
        else:
            staff = HotelStaff.objects.all().select_related('hotel')
        serializer = HotelStaffSerializer(staff, many=True)
        return Response(serializer.data)


class HotelAndGuestCounts(APIView):
    def get(self, request, format=None):
        start_date = request.query_params.get('start_date', '').strip()
        end_date = request.query_params.get('end_date', '').strip()
        hotel_user_name = request.query_params.get('hotel_user_name', '').strip()
        
        total_hotels = None
        total_guests = 0
        avg_guests_per_day = None
        out_of_state_guests = 0
        long_stay_guests = 0  
        most_visited_hotel = None  
        guest_filter = Guests.objects.all()
        
        if hotel_user_name:
            guest_filter = guest_filter.filter(hotel_user_name=hotel_user_name)
        else:
            total_hotels = Hotels.objects.filter(is_approved=1).count()

        if start_date and end_date:
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d')
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
                if start_date <= end_date:
                    guests_in_date_range = guest_filter.filter(check_in__range=[start_date, end_date])
                    total_guests = guests_in_date_range.count()
                    out_of_state_guests = guests_in_date_range.exclude(guest_state='Haryana').count()
                    num_days = (end_date - start_date).days + 1  
                    avg_guests_per_day = total_guests / num_days if num_days > 0 else 0

                    five_days = timedelta(days=5)
                    long_stay_guests = guests_in_date_range.annotate(
                        stay_duration=ExpressionWrapper(
                            F('check_out') - F('check_in'),
                            output_field=fields.DurationField()
                        )
                    ).filter(stay_duration__gt=five_days).count()
                    
                    most_visited_hotel_data = guests_in_date_range.values('hotel').annotate(
                        guest_count=Count('id')
                    ).order_by('-guest_count').first()

                    if most_visited_hotel_data:
                        hotel = Hotels.objects.get(id=most_visited_hotel_data['hotel'])
                        most_visited_hotel = {
                            'hotel_user_name': hotel.hotel_user_name,
                            'hotel_name': hotel.hotel_name,
                            'guest_count': most_visited_hotel_data['guest_count']
                        }
                    
                else:
                    return Response({'error': 'start_date must be before or the same as end_date.'}, status=400)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)
        else:
            total_guests = guest_filter.count()
            out_of_state_guests = guest_filter.exclude(guest_state='Haryana').count()
            five_days = timedelta(days=5)
            long_stay_guests = guest_filter.annotate(
                stay_duration=ExpressionWrapper(
                    F('check_out') - F('check_in'),
                    output_field=fields.DurationField()
                )
            ).filter(stay_duration__gt=five_days).count()

            most_visited_hotel_data = guest_filter.values('hotel').annotate(
                guest_count=Count('guest_id')
            ).order_by('-guest_count').first()

            if most_visited_hotel_data:
                hotel = Hotels.objects.get(id=most_visited_hotel_data['hotel'])
                most_visited_hotel = {
                    'hotel_user_name': hotel.hotel_user_name,
                    'hotel_name': hotel.hotel_name,
                    'guest_count': most_visited_hotel_data['guest_count']
                }

        if total_hotels is not None:
            avg_guests_per_hotel = total_guests / total_hotels if total_hotels > 0 else 0
        else:
            avg_guests_per_hotel = None

        data = {
            'total_guests': total_guests,
            'avg_guests_per_hotel': avg_guests_per_hotel,
            'avg_guests_per_day': avg_guests_per_day,
            'out_of_state_guests': out_of_state_guests,
            'long_stay_guests': long_stay_guests,  
            'most_visited_hotel': most_visited_hotel 
        }

        if total_hotels is not None:
            data['total_hotels'] = total_hotels

        return Response(data)

class PincodeView(APIView):
    def post(self, request, format=None):
        pincode = request.data.get('pincode', '')
        if pincode:
            url = f"https://api.postalpincode.in/pincode/{pincode}"
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()[0]
                return Response(data)
            else:
                return Response({"error": "Unable to fetch data"}, status=response.status_code)
        else:
            return Response({"error": "Pincode not provided"}, status=400)  
        
        
class GeocodeView(APIView):
    def post(self, request, *args, **kwargs):
        address = request.data.get('address')
        if address:
            lat, lng = self.get_lat_long_opencage(address)
            if lat and lng:
                return Response({'latitude': lat, 'longitude': lng}, status=status.HTTP_200_OK)
            return Response({'error': 'Address not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'Address is required'}, status=status.HTTP_400_BAD_REQUEST)

    def get_lat_long_opencage(self, address):
        base_url = "https://api.opencagedata.com/geocode/v1/json"
        params = {
            'q': address,
            'key': 'efa4e51481064dc5abfbb05490daee8f',
            'limit': 1,
        }
        try:
            response = requests.get(base_url, params=params)
            response.raise_for_status() 
            print(f"Response status code: {response.status_code}")
            print(f"Response content: {response.content}")
            results = response.json()
            if results['results']:
                location = results['results'][0]['geometry']
                print(f"Location found: {location}")
                return location['lat'], location['lng']
            else:
                print("No results found")
        except requests.exceptions.RequestException as e:
            print(f"Error connecting to OpenCage API: {e}")
        return None, None
    
class NotificationsAPI(APIView):
    def get(self, request, format=None):
        notifications = Notifications.objects.filter(active=1)
        count = notifications.count()
        serializer = NotificationSerializer(notifications, many=True)
        data = {
            'status': 'success',
            'notifications_count': count,
            'notifications': serializer.data
        }
        return Response(data)
    
class UpdateNotificationView(APIView):
    def post(self, request, *args, **kwargs):
        not_id = request.query_params.get('not_id')
        if not_id is None:
            return Response({'error': 'not_id query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            notification = Notifications.objects.get(not_id=not_id)
        except Notifications.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
        
        notification.active = '0'
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response({'status': 'success'}, status=status.HTTP_200_OK)    