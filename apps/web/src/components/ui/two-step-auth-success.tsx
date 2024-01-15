import { Button } from "./button";
import { DialogDescription } from "./dialog";
import { IconProps, Icons } from "./icons";
import { handleCopy } from "./../../lib/utils";

export const SuccessDialog = ({
  title,
  description,
  onClick,
  backupCode,
}: {
  title: string;
  description: string;
  backupCode?: string[] | any;
  onClick: React.MouseEventHandler<any>;
}) => {
  const icons = [
    <Icons.download className="h-4 cursor-pointer" />,
    <Icons.print className="h-4 cursor-pointer" />,
    <Icons.copy color="green" className="h-4 cursor-pointer" onClick={handleCopy} />,
  ];

  return (
    <section className="pt-5">
      <Icons.circleCheck className="mx-auto h-7 w-7" />
      <div className="text-center text-sm font-semibold text-primary">{title}</div>
      <div className="mb-5 mt-6 text-center text-sm font-medium text-foreground">{description}</div>
      {backupCode?.length > 0 && (
        <section className="mx-auto mb-10 w-full max-w-[206px] overflow-hidden rounded border border-[#C2FFE2] bg-success-foreground">
          <main className="flex flex-wrap gap-5 p-5 font-body text-xs font-bold text-foreground opacity-70">
            {backupCode?.map((code: string, idx: number) => (
              <div key={idx}>{code}</div>
            ))}
          </main>
          <footer className="flex h-8 w-full items-center justify-center gap-10 border-t border-primary">
            {icons.map((icon: JSX.Element | any, idx: number) => (
              <>{icon}</>
            ))}
          </footer>
        </section>
      )}

      <Button onClick={onClick} className="float-right">
        Done
      </Button>
    </section>
  );
};
