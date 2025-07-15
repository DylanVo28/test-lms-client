import { useRouter } from 'next/router';

const useNavigate = () => {
  const router = useRouter();

  const navigate = (path: string, query?: any) => {
    if (router?.query?.code) {
      router.push({
        pathname: `/${router.query.code}${path}`,
        query,
      });
    } else {
      router.push(path);
    }
  };

  return {
    navigate,
  };
};

export default useNavigate;
