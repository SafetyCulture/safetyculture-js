import Api from './api';
import Audits from './audits';

export default function Client({ token }) {
  const api = Api({ token });

  return {
    audits: Audits(api)
  };
}
