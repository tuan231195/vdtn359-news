import React from 'react';
import { Field } from 'formik';

export interface FormFieldProps<P> {
    component: React.FunctionComponent<P>;
    componentProps?: P;
    name: string;
    value?: any;
    showError?: boolean;
    children?: any;
    validate?: (value: any) => string | Promise<void> | undefined;
    onChange?: (
        e: React.ChangeEvent<any>,
        params?: { name?: string; value?: any }
    ) => void;
    onBlur?: (e: React.FocusEvent<any>) => void;
}

export const SemanticField = <T extends object>({
    component,
    componentProps,
    showError = true,
    ...fieldProps
}: FormFieldProps<T>) => (
    <Field name={fieldProps.name} validate={fieldProps.validate}>
        {({
            field: { value, ...field },
            form: { setFieldValue, submitCount, touched, errors, handleBlur },
            ...props
        }) => {
            let valueProps;
            const name = (component as any).name;
            if (name === 'FormRadio') {
                valueProps = {
                    checked: fieldProps.value === value,
                };
            } else if (name === 'FormCheckbox') {
                valueProps = {
                    checked: !!value,
                };
            } else {
                valueProps = {
                    value: value || '',
                };
            }
            return React.createElement(component, {
                ...componentProps,
                ...field,
                ...props,
                ...valueProps,
                ...((submitCount > 1 || touched[field.name]) &&
                errors[field.name] &&
                showError
                    ? {
                          error: {
                              content: errors[field.name],
                          },
                      }
                    : {}),
                onChange: (e, { value: newValue, checked }) => {
                    setFieldValue(
                        fieldProps.name,
                        newValue ? newValue : checked
                    );
                    if (fieldProps.onChange) {
                        fieldProps.onChange(e, {
                            value: checked !== undefined ? checked : value,
                            name: fieldProps.name,
                        });
                    }
                },
                onBlur: (e) => {
                    handleBlur(e);
                    if (fieldProps.onBlur) {
                        fieldProps.onBlur(e);
                    }
                },
            });
        }}
    </Field>
);
