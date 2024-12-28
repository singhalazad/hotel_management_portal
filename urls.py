from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('add-hotel-staff/', views.HotelStaffCreateView.as_view(), name='hotel_staff_create'),
    path('hotel-staff-detail/', views.HotelStaffAPIView.as_view(), name='hotel_staff_detail'),
    path('dashboard-counts/', views.HotelAndGuestCounts.as_view(), name='hotel-and-guest-counts'),
    path('pincode-to-address/', views.PincodeView.as_view(), name='pincode-detail'),
    path('geocode/', views.GeocodeView.as_view(), name='geocode'),
    path('notifications/', views.NotificationsAPI.as_view(), name='notifications'),
    path('notifications-update/', views.UpdateNotificationView.as_view(), name='update-notification'),
    
]