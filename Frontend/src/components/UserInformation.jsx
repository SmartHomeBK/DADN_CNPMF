import React from "react";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
import moment from "moment";
const UserInformation = () => {
  const { userInfor } = useSelector((state) => state.auth);
  console.log("userInfor in UserInformation: ", userInfor);
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="min-w-[500px]">
        <div className="bg-gray-100">
          <div className="content text-center py-10 px-10">
            <div className="top flex flex-col gap-2 items-center">
              <div className="rounded-full size-32 bg-red-200 flex justify-center items-center">
                <User className="size-20" />
              </div>
              <p className="text-2xl font-semibold">{userInfor.fullName}</p>
            </div>
            <div
              className="w-2/3 h-[2px] bg-slate-200 mx-auto mt-4
            "
            ></div>
            <div className="user-infor flex flex-col gap-2 mt-3">
              <div className="flex justify-between items-center">
                <p>Email:</p>
                <p className="font-semibold">{userInfor.email}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Created at:</p>
                <p className="font-semibold">
                  {moment(userInfor.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
