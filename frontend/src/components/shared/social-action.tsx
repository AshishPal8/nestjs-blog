import { Icons } from "./icons";

const SocialAction = () => {
  return (
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icons.like
            size={24}
            className="text-blue-400 hover:text-blue-500 cursor-pointer"
          />
          <span className="text-gray-400">10</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.comment
            size={24}
            className="text-gray-500 hover:text-gray-600 cursor-pointer"
          />
          <span className="text-gray-400">10</span>
        </div>
        <div className="flex items-center gap-2">
          <Icons.share
            size={24}
            className="text-green-500 hover:text-green-600 cursor-pointer"
          />
          <span className="text-gray-400">10</span>
        </div>
      </div>
      <div>
        <Icons.bookmark
          size={24}
          className="text-gray-500 hover:text-gray-600 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SocialAction;
