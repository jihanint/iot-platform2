import type {
  IRequestDeleteUserAssignment,
  IRequestUserAssignment,
  IRequestUserManagerAssignment,
} from "@/services/user/assignment/type";
import useUserAssignmentMutation from "@/services/user/assignment/useUserAssignmentMutation";

export default function useFetchAssignmentData() {
  const { mutateUserManagerAssignmentSuccess, mutateUserAssignment, mutateUserMangerAssignment } =
    useUserAssignmentMutation();

  const handleSubmitUserAssignment = (data: IRequestUserAssignment) => {
    mutateUserAssignment({ ...data });
  };

  const handleDeleteUserAssignment = (data: IRequestDeleteUserAssignment) => {
    mutateUserAssignment({ ...data });
  };
  /**
   * This function for create a new manager then assign to new village
   */
  const handleSubmitAssignNewManager = (data: IRequestUserManagerAssignment) => {
    mutateUserMangerAssignment({ ...data });
  };

  return {
    handleSubmitUserAssignment,
    handleSubmitAssignNewManager,
    handleDeleteUserAssignment,
    isSuccessMutateUserManagerAssignment: mutateUserManagerAssignmentSuccess,
  };
}
