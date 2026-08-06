import { useCustomerProfile } from "./useCustomerProfile";
import { useCustomerAddresses } from "./useCustomerAddresses";

/**
 * A profile is "complete" once name + phone are set and at least one billing
 * address exists. There is no server-side flag for this — it's derived from
 * the profile and address list, both already fetched via react-query.
 */
export function useProfileCompletion() {
    const profileQuery = useCustomerProfile();
    const addressesQuery = useCustomerAddresses();

    const isLoading = profileQuery.isLoading || addressesQuery.isLoading;
    const profile = profileQuery.data;
    const addresses = addressesQuery.data ?? [];

    const hasName = Boolean(profile?.name?.trim());
    const hasPhone = Boolean((profile?.phone ?? profile?.mobile)?.trim());
    const hasAddress = addresses.length > 0;

    const isComplete = hasName && hasPhone && hasAddress;

    return {
        isLoading,
        isComplete,
        profile,
        defaultAddress: addresses.find((address) => address.isDefault) ?? addresses[0],
    };
}
