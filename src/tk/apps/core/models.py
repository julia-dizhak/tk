import uuid
from django.db import models


class Task(models.Model):
    TASK_STATUSES = (
        ('new', 'New'),
        ('todo', 'TODO'),
        ('inprogress', 'In progress'),
        ('done', 'Done')
    )
    name = models.CharField(max_length=255)
    desc = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, db_index=True,
        choices=TASK_STATUSES, default='new'
    )
    uuid = models.CharField(max_length=32, db_index=True, editable=False)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.uuid:
            self.uuid = uuid.uuid4().hex
        super(Task, self).save(*args, **kwargs)
