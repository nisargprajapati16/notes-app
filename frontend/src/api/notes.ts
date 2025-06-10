import axios from './axios';

export interface Note {
  _id: string;
  title: string;
  content: string;
  user: { _id: string; email: string };
  updatedBy?: { _id: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await axios.get<Note[]>('/api/notes');
  return res.data;
}

export async function createNote(title: string, content: string): Promise<Note> {
  const res = await axios.post<Note>('/api/notes', { title, content });
  return res.data;
}

export async function updateNote(id: string, title: string, content: string): Promise<Note> {
  const res = await axios.put<Note>(`/api/notes/${id}`, { title, content });
  return res.data;
}

export async function deleteNote(id: string): Promise<void> {
  await axios.delete(`/api/notes/${id}`);
} 