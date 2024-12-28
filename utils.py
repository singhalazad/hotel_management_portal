from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six

class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            six.text_type(user.pk) + six.text_type(timestamp) +
            six.text_type(user.is_active)
        )

custom_token_generator = CustomPasswordResetTokenGenerator()
