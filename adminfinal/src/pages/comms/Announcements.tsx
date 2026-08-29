import React, { useState } from 'react';
import { MegaphoneIcon, PinIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Label, Select, Textarea } from '../../components/ui/Field';
import { Avatar } from '../../components/ui/Primitives';
import { personById, priorities, type Announcement, type Priority } from '../../data/communications';
import { useComms } from '../../contexts/CommsContext';
import { useAuth } from '../../contexts/AuthContext';

const categories: Announcement['category'][] = ['Product', 'Maintenance', 'Process', 'People'];

const priorityTone: Record<Priority, 'neutral' | 'info' | 'warning' | 'negative'> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Urgent: 'negative'
};

export function Announcements() {
  const { user } = useAuth();
  const { announcements, postAnnouncement } = useComms();
  const isSuperAdmin = user?.roleId === 'super';

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Product');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [audience, setAudience] = useState('All admins');

  function publish() {
    if (!title.trim() || !body.trim()) return;
    postAnnouncement({ title: title.trim(), body: body.trim(), category, priority, audience });
    setTitle('');
    setBody('');
    setOpen(false);
  }

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle={
        isSuperAdmin ?
        'Posted by the Super Admin and shown as a banner on every dashboard.' :
        'Read-only. Only the Super Admin can publish announcements.'
        }
        actions={
        isSuperAdmin ?
        <Button variant="primary" icon={MegaphoneIcon} onClick={() => setOpen(true)}>
              New announcement
            </Button> :
        null
        } />
      

      <div className="space-y-4">
        {announcements.map((announcement) => {
          const author = personById(announcement.postedBy);
          return (
            <Card key={announcement.id} className="p-5">
              <div className="flex flex-wrap items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/25 text-ink">
                  <MegaphoneIcon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold tracking-tight text-ink">{announcement.title}</h2>
                    {announcement.pinned ?
                    <Badge tone="accent">
                        <PinIcon className="h-3 w-3" /> Pinned
                      </Badge> :
                    null}
                    <Badge tone="neutral">{announcement.category}</Badge>
                    <Badge tone={priorityTone[announcement.priority]}>{announcement.priority}</Badge>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{announcement.body}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <Avatar name={author?.name ?? 'Admin'} size="sm" />
                    <span className="font-medium text-ink">{author?.name}</span>
                    <span>· {announcement.at}</span>
                    <span>· Audience: {announcement.audience}</span>
                  </div>
                </div>
              </div>
            </Card>);

        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Publish announcement"
        description="Pinned announcements appear as a banner across every admin dashboard until dismissed."
        footer={
        <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={publish}>
              Publish
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="ann-title">Title</Label>
            <Input
              id="ann-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Hourly slot pricing v2 rolls out on 22 Aug" />
            
          </div>
          <div>
            <Label htmlFor="ann-body">Message</Label>
            <Textarea
              id="ann-body"
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What is changing, who it affects, and what they need to do." />
            
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="ann-category">Category</Label>
              <Select
                id="ann-category"
                options={categories}
                value={category}
                onChange={(event) => setCategory(event.target.value as Announcement['category'])} />
              
            </div>
            <div>
              <Label htmlFor="ann-priority">Priority</Label>
              <Select
                id="ann-priority"
                options={priorities}
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)} />
              
            </div>
            <div>
              <Label htmlFor="ann-audience">Audience</Label>
              <Select
                id="ann-audience"
                options={['All admins', 'Operations', 'Finance', 'Support', 'Marketing', 'Management']}
                value={audience}
                onChange={(event) => setAudience(event.target.value)} />
              
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}