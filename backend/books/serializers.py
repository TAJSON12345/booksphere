from rest_framework import serializers

from .models import Book


class BookSerializer(serializers.ModelSerializer):

    suggested_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'description',
            'cover_image',
            'status',
            'suggested_by',
            'suggested_by_name',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'suggested_by',
            'suggested_by_name',
            'created_at',
            'updated_at',
        ]

    def get_suggested_by_name(self, obj):

        if obj.suggested_by:
            return obj.suggested_by.username

        return None