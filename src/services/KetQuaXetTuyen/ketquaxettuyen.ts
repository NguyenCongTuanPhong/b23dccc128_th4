import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const url = 'ket-qua-xet-tuyen';

export function getMyKetQuaXetTuyen(idDotTuyenSinh: string) {
  return axios.get(`${ip3}/${url}/thi-sinh/my/dot/${idDotTuyenSinh}`);
}

export const xacNhanNhapHoc = (mode: 'xac-nhan' | 'khong-xac-nhan', idKetQua: string) => {
  return axios.put(`${ip3}/${url}/${mode}/${idKetQua}`);
};
