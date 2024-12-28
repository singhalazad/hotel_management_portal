from rest_framework import serializers
from guests.models import Guests, GuestDocument
from hotels.models import Hotels, HotelStaff


class HotelStaffSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.hotel_name', read_only=True)
    
    class Meta:
        model = HotelStaff
        fields = '__all__'
        read_only_fields = ('cr_dt', 'upd_dt')

    def validate_email(self, value):
        if value and HotelStaff.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_mobile(self, value):
        if value and not value.isdigit():
            raise serializers.ValidationError("Mobile number must contain only digits.")
        return value
        
        
     
         
         