export const CheckBox = () => {
  return (
    <div className="flex items-center mb-4">
      <input
        id="default-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded "
      />
      {/* <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label> */}
    </div>
  );
};
