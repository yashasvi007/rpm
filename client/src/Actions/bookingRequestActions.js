import axios from "axios";
import {
  GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER,
  GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER_SUCCESSFULL,
  GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER_FAILED
} from "./types";

export const fetchBookingRequestByDateAndProvider = (
  providerId,
  dateRange,
  type
) => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER
      });
      let response = await axios.post("/api/getBookingRequest", {
        providerId: providerId,
        dateRange,
        type
      });
      let bookingRequestRespone = response.data;

      if (!bookingRequestRespone.error) {
        dispatch({
          type: GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER_SUCCESSFULL,
          payload: bookingRequestRespone
        });
      } else {
        dispatch({
          type: GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER_FAILED
        });
      }
    } catch (err) {
      dispatch({
        type: GET_APPROVED_BOOKING_REQUEST_BY_DATE_PROVIDER_FAILED
      });
    }
  };
};
