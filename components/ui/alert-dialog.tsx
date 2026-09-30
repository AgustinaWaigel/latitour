'use client';
import * as Dialog from '@radix-ui/react-alert-dialog';
import { Button } from './button';
export function ConfirmDelete({
  name,
  pending,
  onConfirm,
}: {
  name: string;
  pending: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="ghost"
          disabled={pending}
          className="text-red-700"
          aria-label={`Eliminar ${name}`}
        >
          Eliminar
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[2000] bg-slate-950/45" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[2001] w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold">
            ¿Eliminar {name}?
          </Dialog.Title>
          <Dialog.Description className="my-4 text-sm text-slate-600">
            El establecimiento dejará de aparecer en Latitour. Esta acción no se
            puede deshacer.
          </Dialog.Description>
          <div className="flex justify-end gap-3">
            <Dialog.Cancel asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.Cancel>
            <Dialog.Action asChild>
              <Button
                className="bg-red-700 hover:bg-red-800"
                onClick={onConfirm}
              >
                Eliminar lugar
              </Button>
            </Dialog.Action>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
