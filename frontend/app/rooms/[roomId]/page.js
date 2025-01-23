import StranicaSoba from "@/components/StranicaSoba";

const Page = async ({ params }) => {
  const { roomId } = await params;

  return (
    <>
      <StranicaSoba roomId={roomId} />
    </>
  );
};

export default Page;
