export async function GET (
  _: Request,
  { params }: { params: { name: string } }
) {
  const name = params.name;
  return await fetch(
    'https://s3.ap-northeast-1.amazonaws.com/physical.sugoroku.musics/' + name
  );
}
