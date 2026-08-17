from django.db import models


class Discussion(models.Model):

    title = models.CharField(max_length=200)

    content = models.TextField()

    book = models.ForeignKey(
        'books.Book',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='discussions'
    )

    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='discussions'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title


class DiscussionReply(models.Model):

    discussion = models.ForeignKey(
        Discussion,
        on_delete=models.CASCADE,
        related_name='replies'
    )

    content = models.TextField()

    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='discussion_replies'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.content[:50]

