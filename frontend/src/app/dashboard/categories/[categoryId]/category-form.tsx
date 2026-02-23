"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Heading } from "@/src/components/ui/heading";
import AlertModal from "@/src/modal/alert-modal";
import { Switch } from "@/src/components/ui/switch";
import { useMutation } from "@apollo/client/react";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/src/graphql/mutations/categories";
import { handleGraphqlError } from "@/src/lib/errors/handleGraphqlErrors";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: (CategoryFormValues & { id?: number }) | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData
    ? "Edit category details"
    : "Add a new category";
  const toastMessage = initialData ? "Category updated." : "Category created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: initialData || {
      name: "",
      isActive: true,
    },
  });

  const [createCategory, { loading: createLoading }] = useMutation(
    CREATE_CATEGORY,
    {
      onCompleted: () => {
        toast.success(toastMessage);
        router.push(`/dashboard/categories`);
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "Error creating category");
        console.error("Create error:", error);
      },
    },
  );

  const [updateCategory, { loading: updateLoading }] = useMutation(
    UPDATE_CATEGORY,
    {
      onCompleted: () => {
        toast.success(toastMessage);
        router.push(`/dashboard/categories`);
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "Error updating category");
        console.error("Update error:", error);
      },
    },
  );

  const [deleteCategory, { loading: deleteLoading }] = useMutation(
    DELETE_CATEGORY,
    {
      onCompleted: () => {
        toast.success("Category deleted.");
        router.push(`/dashboard/categories`);
        router.refresh();
      },
      onError: (error) => {
        toast.error(
          "Failed to delete the category. Please ensure all dependencies are removed.",
        );
        console.error("Delete error:", error);
      },
    },
  );

  const loading = createLoading || updateLoading || deleteLoading;

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (submitted) return;
      setSubmitted(true);
      if (initialData) {
        await updateCategory({
          variables: {
            id: parseInt(params.categoryId as string),
            input: {
              name: values.name,
              description: values.description,
              isActive: values.isActive,
            },
          },
        });
      } else {
        await createCategory({
          variables: {
            input: {
              name: values.name,
              description: values.description,
              isActive: values.isActive,
            },
          },
        });
      }
    } catch (error) {
      handleGraphqlError(error);
    } finally {
      setSubmitted(false);
    }
  };

  const onDelete = async () => {
    try {
      await deleteCategory({
        variables: {
          id: parseInt(params.categoryId as string),
        },
      });
    } catch (error) {
      handleGraphqlError(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Enter category name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      {...field}
                      placeholder="Enter category description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Active</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading || submitted}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
