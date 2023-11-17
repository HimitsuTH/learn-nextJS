const ItemUpload = (props: any) => {
  const { file, removeFile } = props;

  return (
    <div className="flex flex-col items-center p-3">
      <div className="flex flex-row space-x-5">
        <span>{file?.name}</span>
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => removeFile()}
        >
          remove
        </span>
      </div>
    </div>
  );
};

export default ItemUpload;
