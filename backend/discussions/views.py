
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Discussion, DiscussionReply
from .serializers import DiscussionSerializer, DiscussionReplySerializer


class DiscussionListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        book_id = request.query_params.get('book')

        if book_id:
            discussions = Discussion.objects.filter(
                book_id=book_id
            ).order_by('-created_at')
        else:
            discussions = Discussion.objects.all().order_by(
                '-created_at'
            )

        serializer = DiscussionSerializer(
            discussions,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = DiscussionSerializer(
            data=request.data
        )

        if serializer.is_valid():
            discussion = serializer.save(
                created_by=request.user
            )

            return Response(
                DiscussionSerializer(discussion).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class DiscussionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            discussion = Discussion.objects.get(pk=pk)

        except Discussion.DoesNotExist:
            return Response(
                {
                    'message': 'Discussion not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DiscussionSerializer(discussion)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request, pk):
        try:
            discussion = Discussion.objects.get(pk=pk)

        except Discussion.DoesNotExist:
            return Response(
                {
                    'message': 'Discussion not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DiscussionReplySerializer(
            data=request.data
        )

        if serializer.is_valid():
            reply = serializer.save(
                discussion=discussion,
                created_by=request.user
            )

            return Response(
                DiscussionReplySerializer(reply).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        try:
            discussion = Discussion.objects.get(pk=pk)

        except Discussion.DoesNotExist:
            return Response(
                {
                    'message': 'Discussion not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only the creator can edit the discussion
        if discussion.created_by != request.user:
            return Response(
                {
                    'message': (
                        'You are not allowed to edit '
                        'this discussion.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = DiscussionSerializer(
            discussion,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            discussion = serializer.save()

            return Response(
                DiscussionSerializer(discussion).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        try:
            discussion = Discussion.objects.get(pk=pk)

        except Discussion.DoesNotExist:
            return Response(
                {
                    'message': 'Discussion not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only the creator can delete the discussion
        if discussion.created_by != request.user:
            return Response(
                {
                    'message': (
                        'You are not allowed to delete '
                        'this discussion.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN
            )

        discussion.delete()

        return Response(
            {
                'message': 'Discussion deleted successfully.'
            },
            status=status.HTTP_200_OK
        )

