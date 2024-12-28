from django.db import models

# Create your models here.
class Hotels(models.Model):
    id = models.AutoField(primary_key=True)
    # name = models.CharField(max_length=2)
    hotel_name = models.CharField(max_length=45, blank=True, null=True)
    hotel_user_name = models.CharField(max_length=45, blank=True, null=True, unique=True)
    password = models.CharField(max_length=128, blank=True, null=True)
    mobile = models.CharField(max_length=45, blank=True, null=True)
    email = models.CharField(max_length=45, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    hotel_address = models.CharField(max_length=45, blank=True, null=True)
    state = models.CharField(max_length=45, blank=True, null=True)
    district = models.CharField(max_length=45, blank=True, null=True)
    city = models.CharField(max_length=45, blank=True, null=True)
    pincode = models.CharField(max_length=45, blank=True, null=True)
    owner_first_name = models.CharField(max_length=45, blank=True, null=True)
    owner_last_name = models.CharField(max_length=45, blank=True, null=True)
    owner_house_address = models.CharField(max_length=45, blank=True, null=True)
    owner_state = models.CharField(max_length=45, blank=True, null=True)
    owner_district = models.CharField(max_length=45, blank=True, null=True)
    owner_city = models.CharField(max_length=45, blank=True, null=True)
    owner_pinode = models.CharField(max_length=45, blank=True, null=True)
    lat = models.CharField(max_length=45, blank=True, null=True)
    long = models.CharField(max_length=45, blank=True, null=True)
    is_approved = models.CharField(max_length=45, blank=True, null=True)
    is_rejected = models.CharField(max_length=45, blank=True, null=True)
    reject_remarks = models.CharField(max_length=45, blank=True, null=True)
    

    class Meta:
        managed = False
        db_table = 'hotels'
        
class HotelStaff(models.Model):
    staff_id = models.AutoField(primary_key=True)
    staff_name = models.CharField(max_length=45, blank=True, null=True)
    position = models.CharField(max_length=45, blank=True, null=True)
    mobile = models.CharField(max_length=45, blank=True, null=True)
    email = models.CharField(max_length=45, blank=True, null=True)
    staff_age = models.CharField(max_length=45, blank=True, null=True)
    staff_gender = models.CharField(max_length=45, blank=True, null=True)
    staff_country = models.CharField(max_length=45, blank=True, null=True)
    staff_state = models.CharField(max_length=45, blank=True, null=True)
    staff_district = models.CharField(max_length=45, blank=True, null=True)
    staff_pincode = models.CharField(max_length=45, blank=True, null=True)
    hotel = models.ForeignKey(Hotels, on_delete=models.CASCADE, related_name='staff')
    hotel_user_name = models.CharField(max_length=45, blank=True, null=True)
    cr_dt = models.DateTimeField(auto_now_add=True)
    upd_dt = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'hotel_staff' 


class States(models.Model):
    state_name = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'states' 
        
class Districts(models.Model):
    district_code = models.CharField(max_length=255)
    district_name = models.CharField(max_length=255)
    state_code = models.ForeignKey('States', models.DO_NOTHING, db_column='state_code', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'districts'                            
