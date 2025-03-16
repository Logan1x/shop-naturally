import ChatInput from "@/components/chatBox";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center bg-gradient-radial from-background to-secondary/60">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6">
        <ChatInput />
      </main>
    </div>
  );
}
