from django.urls import path

from .views import (
    BookDetailView,
    BookListCreateView,
    BookVoteView,
    BookApprovalView,
)


urlpatterns = [
    path(
        '',
        BookListCreateView.as_view(),
        name='book-list-create'
    ),

    path(
        '<int:pk>/',
        BookDetailView.as_view(),
        name='book-detail'
    ),

    path(
        '<int:pk>/vote/',
        BookVoteView.as_view(),
        name='book-vote'
    ),

    path(
    '<int:pk>/approve/',
    BookApprovalView.as_view(),
    name='book-approve'
),
]