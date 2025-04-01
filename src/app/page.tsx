import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Bold, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";

import { db } from "@/lib/db";
import { chatGroups, chats } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";





export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

// greatest id chat of the user 
let greatestChatId = null;

if (isAuth) {
  // Fetch the greatest chat ID for the authenticated user
  const greatestChat = await db
    .select()
    .from(chatGroups)
    .where(eq(chatGroups.userId, userId))
    .orderBy(desc(chatGroups.id))
    .limit(1);

  if (greatestChat.length > 0) {
    greatestChatId = greatestChat[0].id;
  }
}

// ----------------------

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-red-300 text-black">
      
      {/* Navbar */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 via-blue-500 to-red-900 shadow-md">
        
        {/* Left-aligned logo and text */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <img
              src="/ProfilePicturePhoto.png" // Update this path to your logo's actual path
              alt="NLL Logo"
              className="w-12 h-12" // Logo size for the navbar
            />
          </Link>
          <span className="text-lg font-semibold text-black">
            LeapBuddy | Chat Assistant for New Leap Labs
          </span>
        </div>
        
        {/* Right-aligned navigation items */}
        <nav className="flex items-center space-x-4">
          {isAuth ? (
            <Link target="blank" href="https://nll-ac7v.onrender.com/">
              <Button 
                variant="ghost" 
                className="text-white text-lg group transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-900 hover:shadow-md"
              >
                Visit{" "}
                <span className="font-bold ml-2">
                  New Leap Labs
                </span>
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="ghost" className="text-white">
                <span className="font-bold text-lg">#WeBelieve</span>
              </Button>
            </Link>
          )}
          <UserButton 
            afterSignOutUrl="/" 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </nav>
      </header>

      {/* Main Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
        <div className="flex items-center justify-between">
          
          {/* Left Section: Title, Button, and Text */}
          <div className="flex flex-col items-start text-left space-y-4 w-1/2">
            <h1 className="text-5xl font-semibold">LeapBuddy</h1>
            <div className="flex mt-2">
              {isAuth && greatestChatId ? (
                <Link href={`/chat/${greatestChatId}`}>
                  <Button className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium">
                    Go to Chats
                  </Button>
                </Link>
              ) : (
                <p className="text-sm text-gray-800"></p>
              )}
            </div>
            <p className="max-w-xl mt-1 text-lg text-black">
              Handle all your documentation references, research queries, and planner's blocks with ease. LeapBuddy is your answer to all kinds of queries.
            </p>
            <div className="w-full mt-4 flex justify-start">
              {isAuth ? (
                <FileUpload />
              ) : (
                <Link href="/sign-in">
                  <Button>
                    Login to get Started!
                    <LogIn className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Section: Logo */}
          <div className="flex items-center justify-center w-1/3">
            <img
              src="/ProfilePicturePhoto.png" // Update this path to your logo's actual path
              alt="NLL Logo"
              className="w-full h-auto mb-4" // Adjust width as needed
            />
          </div>
        </div>
      </div>
    </div>
  );
}
