"use client";
import { chatGroups, DrizzleChatGroup } from "@/lib/db/schema";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chatGroups: DrizzleChatGroup[]; // Updated to accept chat group data
  chatGroupId: number; // Active chat group ID
};

const ChatSideBar = ({ chatGroups, chatGroupId }: Props) => {
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  // Toggle menu visibility for the three-dot menu
  const toggleMenu = (chatGroupId: number) => {
    setMenuOpen((prev) => (prev === chatGroupId ? null : chatGroupId));
  };

  // Handle edit function
  const handleEdit = async (chatGroupId: number, currentName: string) => {
    const newName = prompt("Enter a new name for the group:", currentName);
    if (newName && newName.trim() !== currentName) {
      try {
        const response = await fetch(`/api/chat/${chatGroupId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName.trim() }), // Update the group name
        });
        if (response.ok) {
          alert("Group name updated successfully!");
          location.reload(); // Refresh the page to reflect changes
        } else {
          alert("Failed to update the group name.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the group name.");
      }
    }
  };

  // Handle delete function
  const handleDelete = async (chatGroupId: number) => {
    if (confirm("Are you sure you want to delete this group?")) {
      try {
        const response = await fetch(`/api/chat/${chatGroupId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Group deleted successfully!");
          location.reload(); // Optionally: Refresh the page or update state
        } else {
          alert("Failed to delete the group.");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting the group.");
      }
    }
  };

  return (
    <div 
      style={{
        background: "linear-gradient(to right, #4b5563, #374151, #1f2937)"
      }}
      className="w-full h-full min-h-screen p-4 text-gray-200 flex flex-col"
    >
      {/* "Create New Chat Group" button */}
      <Link href="/">
        <Button 
          className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800 transition-all duration-200 border-none"
        >
          <PlusCircle className="mr-2 w-4 h-4" />
          Create New Group
        </Button>
      </Link>

      {/* Chat group list */}
      <div className="flex flex-col gap-2 mt-4 overflow-y-auto flex-1">
        {chatGroups.map((group) => (
          <div key={group.id} className="relative group">
            <Link href={`/chat/${group.id}`}>
              <div
                className={cn(
                  "rounded-lg p-3 text-slate-400 flex items-center justify-between",
                  {
                    "bg-gradient-to-r from-gray-800 to-gray-900 text-white": group.id === chatGroupId,
                    "hover:text-white": group.id !== chatGroupId,
                  }
                )}
              >
                <div className="flex items-center">
                  <MessageCircle className="mr-2" />
                  <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                    {group.name}
                  </p>
                </div>
              </div>
            </Link>

            {/* Three-dot menu */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ zIndex: 40 }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleMenu(group.id);
                }}
                className="p-1 rounded-md overflow-hidden text-slate-400 hover:bg-gray-200"
              >
                ⋮
              </button>

              {/* Dropdown menu */}
              {menuOpen === group.id && (
                <div 
                  className="absolute top-full right-0 mt-1 bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg rounded-md overflow-hidden min-w-[120px]"
                  style={{ zIndex: 999999 }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEdit(group.id, group.name);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-200 hover:bg-gray-600 transition-colors duration-150 flex items-center gap-2"
                  >
                    <span className="text-base">✏️</span>
                    Edit
                  </button>
                  <div className="h-[1px] bg-gray-600/50"></div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(group.id);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-200 hover:bg-red-500/30 transition-colors duration-150 flex items-center gap-2"
                  >
                    <span className="text-base">🗑️</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-1 flex justify-center items-center h-12">
        <Link href="/">
          <Button 
            className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800 transition-all duration-200 border-none"
          >
            Back To Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChatSideBar;
