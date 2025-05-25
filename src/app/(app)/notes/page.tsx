'use client';

import { useState, useEffect } from 'react';
import { MarkdownInput } from '@/components/notes/MarkdownInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { PlusCircle, Edit2, Trash2, FileText } from 'lucide-react';
import type { Note } from '@/types';
import { MOCK_NOTES } from '@/data/mock';
import { format } from 'date-fns';

export default function MarkdownNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Simulate fetching notes
    setNotes(MOCK_NOTES);
  }, []);

  const handleSaveNote = (title: string, content: string) => {
    const now = new Date().toISOString();
    if (selectedNote && isEditing) {
      // Update existing note
      const updatedNote = { ...selectedNote, title, content, updatedAt: now };
      setNotes(notes.map(n => (n.id === updatedNote.id ? updatedNote : n)));
      const mockNoteIndex = MOCK_NOTES.findIndex(n => n.id === updatedNote.id);
      if (mockNoteIndex > -1) MOCK_NOTES[mockNoteIndex] = updatedNote;

    } else {
      // Create new note
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title,
        content,
        createdAt: now,
        updatedAt: now,
      };
      setNotes([newNote, ...notes]);
      MOCK_NOTES.unshift(newNote);
    }
    setIsEditing(false);
    setSelectedNote(null);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false); // View mode first
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };
  
  const handleAddNewNote = () => {
    setSelectedNote(null);
    setIsEditing(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
    const mockNoteIndex = MOCK_NOTES.findIndex(n => n.id === noteId);
    if (mockNoteIndex > -1) MOCK_NOTES.splice(mockNoteIndex, 1);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // If was adding new, selectedNote is null, so clear form
    // If was editing existing, selectedNote is set, form will revert to it or clear if it was null
    if (!selectedNote) setSelectedNote(null); 
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full max-h-[calc(100vh-theme(spacing.32))]">
      {/* Notes List */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">My Notes</h2>
          <Button onClick={handleAddNewNote} size="sm" className="shadow">
            <PlusCircle className="mr-2 h-4 w-4" /> New Note
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {notes.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No notes yet. Create one!</p>
          )}
          {notes.map(note => (
            <Card 
              key={note.id} 
              onClick={() => handleSelectNote(note)}
              className={`cursor-pointer hover:shadow-md transition-shadow ${selectedNote?.id === note.id && !isEditing ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="p-3">
                <CardTitle className="text-base font-medium truncate">{note.title || "Untitled Note"}</CardTitle>
                <CardDescription className="text-xs">
                  Last updated: {format(new Date(note.updatedAt), "PPp")}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Markdown Editor/Viewer */}
      <div className="flex-1 md:w-2/3 lg:w-3/4">
        {isEditing ? (
          <MarkdownInput 
            note={selectedNote} 
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
          />
        ) : selectedNote ? (
          <Card className="h-full flex flex-col shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-semibold">{selectedNote.title || "Untitled Note"}</CardTitle>
                <CardDescription>
                  Created: {format(new Date(selectedNote.createdAt), "PPp")} | Updated: {format(new Date(selectedNote.updatedAt), "PPp")}
                </CardDescription>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEditNote(selectedNote)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                 <Button variant="destructiveOutline" size="icon" onClick={() => handleDeleteNote(selectedNote.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto prose prose-sm dark:prose-invert max-w-none p-6 bg-secondary/20 rounded-b-md">
              {/* Basic markdown display, for full rendering use a library like react-markdown */}
              <pre className="whitespace-pre-wrap font-sans text-sm">{selectedNote.content}</pre>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-border rounded-lg bg-secondary/30">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a note to view or edit, or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
