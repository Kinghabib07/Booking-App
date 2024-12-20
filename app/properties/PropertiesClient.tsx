'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { Listing, User } from "@/app/types";

interface PropertiesClientProps {
  currentUser?: User | null;
  listings: Listing[]
}
const PropertiesClient: React.FC<PropertiesClientProps> = ({
  currentUser,
  listings
}) => {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState('')

  const onDelete = useCallback((id: string) => {
    setDeletingId(id)

    axios.delete(`/api/listings/${id}`).then(() => {
      toast.success('Listing deleted')
      router.refresh()

    }).catch((err) => {
      toast.error(err?.response?.data?.error)
    }).finally(() => {
      setDeletingId('')
    })

  }, [router])
  return (
    <Container>
      <Heading
        title="Properties"
        subtitle="List of your properties"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
            actionId={listing.id}
            onAction={onDelete}
            disable={deletingId === listing.id}
            actionLabel="Delete property"
          />
        ))}
      </div>
    </Container>
  );
}

export default PropertiesClient;