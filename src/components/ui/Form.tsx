import React, { createContext, useContext, useId } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

import { View } from "./Styled";
import { Typography } from "./Typography";

import { cn } from "@/lib/utils";

const Form = FormProvider;
const FormFieldContext = createContext({} as { name: string });
const FormItemContext = createContext({} as { id: string });

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
  const fieldState = getFieldState(fieldContext.name, formState);
  return { id: itemContext.id, name: fieldContext.name, ...fieldState };
};

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

const FormItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View className={cn("mb-4", className)}>{children}</View>
    </FormItemContext.Provider>
  );
};

const FormMessage = ({ className }: { className?: string }) => {
  const { error } = useFormField();
  if (!error) return null;
  return (
    <Typography variant="xs" className={cn("text-error mt-1 ml-1", className)}>
      {String(error?.message)}
    </Typography>
  );
};

export { useFormField, Form, FormItem, FormMessage, FormField };
