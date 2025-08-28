"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import {
  TechniqueCategory,
  SubCategoriesMap,
  TechniqueSubCategory,
  Technique,
  KyuLevel,
} from "~/models/technique";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import useFirebaseData from "~/services/firebase-data-service";

const FormSchema = z.object({
  category: z.string({
    required_error: "Please select the technique category",
  }),
  sub_category: z.string().optional(),
  name: z
    .string({
      required_error: "Please enter the technique name",
    })
    .min(1),
  name_jp: z.string().optional(),
  kyu: z
    .number({
      required_error: "Please enter the technique kyu",
    })
    .min(1)
    .max(6),
  tkp: z.number({
    required_error: "Please enter the technique tkp",
  }),
  description: z
    .string({
      required_error: "Please enter the technique description",
    })
    .optional(),
});

function NewTechniqueDialog() {
  const { data, isLoading, error } = useFirebaseData<Technique>("techniques");
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    disabled: isLoading,
  });

  const { isValid, isDirty } = useFormState(form);

  const selectedCategory = form.watch("category");

  const [subCategories, setSubCategories] = useState<TechniqueSubCategory[]>(
    []
  );

  useEffect(() => {
    setSubCategories(
      SubCategoriesMap[selectedCategory as keyof typeof TechniqueCategory]
    );
  }, [selectedCategory]);

  useEffect(() => {
    console.log("Form state changed", form.formState);
  }, [isValid, isDirty]);

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    const idPrefix = formData.sub_category
      ? `${formData.category}-${formData.sub_category}`
      : formData.category;
    console.log(idPrefix);
    const nextId =
      data
        .filter((t) => t.id.startsWith(idPrefix))
        .map((t) => parseInt(t.id.split("-").reverse()[0]))
        .reduce((acc, t) => {
          if (t > acc) {
            acc = t;
          }
          return acc;
        }, 0 as number) + 1;
    console.log(nextId);
    toast("You submitted the following values: " + JSON.stringify(formData));
    if (form.formState.isSubmitted) {
      setOpen(false);
    }
  }

  function closeDialog() {
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            {
              form.reset();
              setOpen(true);
            }
          }}
        >
          Add new technique
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={closeDialog}
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex justify-between">
              <div>Add new technique</div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Add a new technique to the database.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField //category
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(
                        Object.keys(TechniqueCategory) as Array<
                          keyof typeof TechniqueCategory
                        >
                      ).map((key) => (
                        <SelectItem
                          key={TechniqueCategory[key]}
                          value={TechniqueCategory[key]}
                        >
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the main category of the technique.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField //sub-category
              control={form.control}
              name="sub_category"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={undefined}
                    disabled={
                      !subCategories?.length || !form.getValues("category")
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sub-category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories?.map((key) => {
                        const [enumKey, enumValue] =
                          Object.entries(TechniqueSubCategory).find(
                            ([k, v]) => v === key
                          ) || [];

                        return (
                          <SelectItem key={enumValue} value={enumValue!}>
                            {enumKey}
                          </SelectItem>
                        );
                      }) ?? null}
                    </SelectContent>
                  </Select>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField //name
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technique details</FormLabel>
                  <Input
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Technique name"
                    type="text"
                    required={form.register(field.name).required}
                  ></Input>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField //description
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Input
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Description"
                  ></Input>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField //kyu
              control={form.control}
              name="kyu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required for kyu</FormLabel>
                  <Select
                    onValueChange={(e) =>
                      field.onChange(KyuLevel[e as keyof typeof KyuLevel])
                    }
                    defaultValue={"white"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the kyu level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.values(KyuLevel) as Array<keyof typeof KyuLevel>)
                        .filter((k) => Number.isInteger(k))
                        .sort((a, b) => KyuLevel[b] - KyuLevel[a])
                        .map((key) => (
                          <SelectItem
                            key={key}
                            value={KyuLevel[key].toString()}
                          >
                            {`${key} Kyu (${KyuLevel[key]})`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField //tkp
              control={form.control}
              name="tkp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training package #</FormLabel>
                  <Select
                    onValueChange={(e) => field.onChange(+e)}
                    defaultValue={"1"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the TKP package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 53 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <Button type="submit" disabled={!isValid}>
                  Save changes
                </Button>

                <Button type="reset" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { NewTechniqueDialog };
