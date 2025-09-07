import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="absolute inset-0 top-[80px] flex justify-center pt-16">
      {/* Full Screen Interview Agent */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <Agent userName={user?.name!} userId={user?.id} type="generate" />
      </div>
    </div>
  );
};

export default Page;
