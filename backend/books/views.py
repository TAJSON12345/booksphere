from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book, BookVote
from .serializers import BookSerializer


class BookListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.all().order_by('-created_at')

        serializer = BookSerializer(
            books,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = BookSerializer(
            data=request.data
        )

        if serializer.is_valid():
            book = serializer.save(
                suggested_by=request.user
            )

            return Response(
                BookSerializer(book).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class BookVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {
                    'message': 'Book not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if book.status != 'suggested':
            return Response(
                {
                    'message': 'This book is not available for voting.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_vote = BookVote.objects.filter(
            book=book,
            user=request.user
        ).first()

        if existing_vote:
            return Response(
                {
                    'message': 'You have already voted for this book.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        BookVote.objects.create(
            book=book,
            user=request.user
        )

        vote_count = BookVote.objects.filter(
            book=book
        ).count()

        return Response(
            {
                'message': 'Vote recorded successfully.',
                'book': book.title,
                'votes': vote_count
            },
            status=status.HTTP_201_CREATED
        )

    def get(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {
                    'message': 'Book not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        vote_count = BookVote.objects.filter(
            book=book
        ).count()

        return Response(
            {
                'book': book.title,
                'votes': vote_count
            },
            status=status.HTTP_200_OK
        )


class BookDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {
                    'message': 'Book not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        if request.user.role != 'admin':
            return Response(
                {
                    'message': 'Administrator access required.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {
                    'message': 'Book not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(
            book,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            book = serializer.save()

            return Response(
                BookSerializer(book).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response(
                {
                    'message': 'Administrator access required.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {
                    'message': 'Book not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        book.delete()

        return Response(
            {
                'message': 'Book deleted successfully.'
            },
            status=status.HTTP_200_OK
        )


class BookApprovalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        # Only admins can approve books
        if request.user.role != 'admin':
            return Response(
                {
                    'message': 'Administrator access required.'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {
                    'message': 'Book not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only suggested books can be approved
        if book.status != 'suggested':
            return Response(
                {
                    'message': 'Only suggested books can be approved.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        book.status = 'active'
        book.save()

        return Response(
            {
                'message': 'Book approved successfully.',
                'book': BookSerializer(book).data
            },
            status=status.HTTP_200_OK
        )