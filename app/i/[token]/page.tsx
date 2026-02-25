import InviteClient from "./InviteClient";

type Props = {
  params: { token: string };
};

export default function Page({ params }: Props) {
  const { token } = params;
  return <InviteClient token={token} />;
}