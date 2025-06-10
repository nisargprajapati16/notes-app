import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "../components/NoteCard";

const mockNote = {
  _id: "1",
  title: "Test Note",
  content: "This is a test note.",
  user: { _id: "u1", email: "test@example.com" },
  updatedBy: { email: "updater@example.com" },
  updatedAt: new Date("2024-06-10T12:00:00Z").toISOString(),
};

describe("NoteCard", () => {
  it("renders title, content, creator, and update info", () => {
    render(
      <NoteCard
        note={mockNote}
        user={{ id: "u1", email: "test@example.com" }}
        openEditModal={jest.fn()}
        deleteMutation={{ mutate: jest.fn() }}
      />
    );
    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("This is a test note.")).toBeInTheDocument();
    expect(screen.getByText(/Created by:/)).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Last updated by:/)).toBeInTheDocument();
    expect(screen.getByText("updater@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  it("calls openEditModal when edit button is clicked", () => {
    const openEditModal = jest.fn();
    render(
      <NoteCard
        note={mockNote}
        user={{ id: "u1", email: "test@example.com" }}
        openEditModal={openEditModal}
        deleteMutation={{ mutate: jest.fn() }}
      />
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(openEditModal).toHaveBeenCalledWith(mockNote);
  });

  it("calls deleteMutation.mutate when delete button is clicked (if user is owner)", () => {
    const deleteMutation = { mutate: jest.fn() };
    render(
      <NoteCard
        note={mockNote}
        user={{ id: "u1", email: "test@example.com" }}
        openEditModal={jest.fn()}
        deleteMutation={deleteMutation}
      />
    );
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(deleteMutation.mutate).toHaveBeenCalledWith(mockNote._id);
  });

  it("does not show delete button if user is not the owner", () => {
    render(
      <NoteCard
        note={mockNote}
        user={{ id: "other", email: "other@example.com" }}
        openEditModal={jest.fn()}
        deleteMutation={{ mutate: jest.fn() }}
      />
    );
    // Only one button (edit) should be present
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });
});