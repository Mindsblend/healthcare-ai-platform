import PageBreadcrumb from "@/components/domain/dashboard/common/PageBreadCrumb";
import DefaultInputs from "@/components/domain/dashboard/form/form-elements/DefaultInputs";
import FileInputExample from "@/components/domain/dashboard/form/form-elements/FileInputExample";
import InputGroup from "@/components/domain/dashboard/form/form-elements/InputGroup";
import InputStates from "@/components/domain/dashboard/form/form-elements/InputStates";
import RadioButtons from "@/components/domain/dashboard/form/form-elements/RadioButtons";
import SelectInputs from "@/components/domain/dashboard/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/domain/dashboard/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/domain/dashboard/form/form-elements/ToggleSwitch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <RadioButtons />
          <ToggleSwitch />
        </div>
      </div>
    </div>
  );
}
