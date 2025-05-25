'use client';

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Note } from '@/types';

interface MarkdownInputProps {
  note?: Note;
  onSave: (title: string, content: string) => void;
  onCancel?: () => void;
  showTitleInput?: boolean;
}

export function MarkdownInput({ note, onSave, onCancel, showTitleInput = true }: MarkdownInputProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  const handleSave = () => {
    onSave(title, content);
  };

  return (
    <Card className="shadow-sm">
      {showTitleInput && (
        <CardHeader>
            <CardTitle className="text-lg">
                 <input 
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border-b border-input bg-transparent focus:outline-none focus:border-primary text-xl font-semibold"
                 />
            </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitleInput ? "pt-0" : "pt-6"}>
        <Textarea
          placeholder="Type your markdown notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] max-h-[500px] resize-y text-base focus:border-primary"
        />
        <div className="mt-4 flex justify-end space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>Save Note</Button>
        </div>
      </CardContent>
    </Card>
  );
}
