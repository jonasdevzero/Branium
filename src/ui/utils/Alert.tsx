import { Root, createRoot } from "react-dom/client";
import { Button, Modal } from "../components";

interface AlertProps {
  title: string;
  description: string;
  confirm?: { label: string; color?: string; onClick(): unknown };
  cancel?: { label: string; color?: string };
  deny?: { label: string; color?: string };
}

interface AlertRenderProps extends AlertProps {
  isLoading: boolean;
  close(): void;
}

export class Alert {
  static create(data: AlertProps) {
    const { confirm } = data;

    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);
    let isLoading = false;

    const render = () => Alert.render(root, { ...data, close, isLoading });

    const close = () => {
      if (isLoading) return;

      root.unmount();
      document.body.removeChild(container);
    };

    const originalOnConfirm = confirm?.onClick;

    const onConfirm = async () => {
      if (!originalOnConfirm) return;

      const promise = originalOnConfirm();

      if (!(promise instanceof Promise)) {
        close();
        return;
      }

      isLoading = true;
      render();

      await promise;

      isLoading = false;
      close();
    };

    if (confirm) confirm.onClick = onConfirm;

    render();
  }

  private static render(root: Root, props: AlertRenderProps) {
    const { title, description, confirm, cancel, deny, isLoading, close } =
      props;

    const hasAction = !!confirm || !!cancel || !!deny;

    root.render(
      <Modal isOpen={true} title={title} close={close}>
        <p>{description}</p>

        {hasAction && (
          <div className="modal__actions">
            {!!cancel && (
              <Button onClick={close} disabled={isLoading}>
                {cancel.label}
              </Button>
            )}

            {!!deny && (
              <Button onClick={close} disabled={isLoading}>
                {deny.label}
              </Button>
            )}

            {!!confirm && (
              <Button onClick={confirm.onClick} isLoading={isLoading}>
                {confirm.label}
              </Button>
            )}
          </div>
        )}
      </Modal>
    );
  }
}
