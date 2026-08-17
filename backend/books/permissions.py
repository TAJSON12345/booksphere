from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):

    message = 'Administrator access required.'

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == 'admin'
        )