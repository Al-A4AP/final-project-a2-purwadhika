import type { FC } from "react";
import { PropertyFormContent } from "./property-form/PropertyFormContent";
import { usePropertyFormState } from "@/hooks/tenant/property-form/usePropertyFormState";

const PropertyFormPage: FC = () => <PropertyFormContent state={usePropertyFormState()} />;

export default PropertyFormPage;
