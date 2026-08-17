from rest_framework import serializers

from .models import Discussion, DiscussionReply


class DiscussionReplySerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    class Meta:
        model = DiscussionReply
        fields = [
            'id',
            'discussion',
            'created_by',
            'user_name',
            'content',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'discussion',
            'created_by',
            'user_name',
            'created_at',
            'updated_at',
        ]


class DiscussionSerializer(serializers.ModelSerializer):

    user_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    replies = DiscussionReplySerializer(
        many=True,
        read_only=True
    )

    book_title = serializers.CharField(
        source='book.title',
        read_only=True
    )

    class Meta:
        model = Discussion

        fields = [
            'id',
            'title',
            'content',
            'book',
            'book_title',
            'created_by',
            'user_name',
            'replies',
            'created_at',
            'updated_at',
        ]

        read_only_fields = [
            'id',
            'created_by',
            'user_name',
            'book_title',
            'replies',
            'created_at',
            'updated_at',
        ]

