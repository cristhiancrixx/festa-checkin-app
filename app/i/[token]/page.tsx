import InviteClient from "./InviteClient";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function Page({ params }: Props) {
  const { token } = await params;
  return <InviteClient token={token} />;
}