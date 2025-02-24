import dateTime from '.'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export const HH_MM_SS_DD_MM_YYYY = 'HH:mm:ss DD-MM-YYYY'

export const YYYY_MM_DD_T_HH_MM_SS_Z = 'YYYY-MM-DD[T]HH:mm:ss[Z]'

export const DD_MM_YYYY = 'DD-MM-YYYY'

export const YYYY_MM_DD = 'YYYY-MM-DD'

export const DD_MM_YYYY_T = 'DD [tháng] MM, [năm] YYYY'

export const HH_mm = 'HH:mm'

export const formatDate = (date: any, format?: string) => {
  return dateTime(date).format(format ?? HH_MM_SS_DD_MM_YYYY)
}


export const formatScheduleTime = (start?: string, end?: string) => {
  const startTime = dayjs.utc(start);  // Đảm bảo sử dụng thời gian UTC
  const endTime = dayjs.utc(end);

  const hStart = startTime.format("HH:mm:ss");  // Định dạng lại
  const hEnd = endTime.format("HH:mm:ss");

  return `${hStart} - ${hEnd}`;
};

// Thêm hàm để định dạng cho lịch
export const formatScheduleForBackend = (startDate: string, startTime: string) => {
  const formattedStartDate = dateTime(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
  const formattedStartTime = dateTime(startTime, 'HH:mm').format('HH:mm:ss')
  
  return `${formattedStartDate}T${formattedStartTime}Z` // Định dạng ISO 8601
}
