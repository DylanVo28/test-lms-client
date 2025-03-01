import { useRouter } from 'next/router';

const useNavigate = () => {
  const router = useRouter();

  const navigate = (path: string, query?: any) => {
    console.log(router, 'router');

    console.log(query, 'query');

    if (router.query.code) {
      console.log('test');

      router.push({
        pathname: `/${router.query.code}${path}`,
        query,
      });
    } else {
      console.log('test23');

      router.push(path);
    }
  };

  return {
    navigate,
  };
};

export default useNavigate;
