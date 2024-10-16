import { useState } from "react";
import { File } from "./file";
import { modal, props } from "./types";

export const FilesDialog = ({ files, isLoading }: props) => {
  const [activeModals, setActiveModals] = useState<modal>({ current: "", list: [] });

  const skeletons = "Lorem ipsum dolor sit, amet";

  return (
    <main >
      <div className="mb-4 text-xl font-bold text-muted-foreground">
        {!isLoading && files.length < 1 ? "Please create a file/Etch" : "Files"}
      </div>
      <div className="grid grid-cols-3 justify-between gap-5 lg:grid-cols-4 xl:grid-cols-5 ">
        {isLoading
          ? skeletons.split("")?.map((item, index) => {
              return (
                <main
                  key={index}
                  className="flex h-11 w-full cursor-default items-center gap-4 rounded-lg bg-accent/50 px-3 !font-body"
                >
                  {" "}
                  <div className="skeleton flex h-4 w-6 items-center justify-end bg-skeleton"></div>
                  <div className="skeleton h-5 w-full truncate bg-skeleton text-base font-medium text-muted-foreground"></div>
                </main>
              );
            })
          : files.map((file) => {
              return <File {...file} key={file.tokenId} activeModals={activeModals} setActiveModals={setActiveModals} />;
            })}
      </div>
    </main>
  );
};
