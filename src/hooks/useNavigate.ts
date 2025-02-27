import { useRouter } from 'next/router';

const useNavigate = () => {
  const router: any = useRouter();
  const { params } = router.query;

  console.log(router, 'router');

  const data =
    params?.length === 2
      ? { code: params[0], id: params[1] }
      : params?.length === 1
      ? { id: params[0] }
      : { code: router.query.id };

  const navigate = (path: string) => {
    if (data?.id) {
      router.push(`/${data?.id}${path}`);
    } else {
      router.push(path);
    }
  };

  return {
    navigate,
    params: data,
  };
};

export default useNavigate;
