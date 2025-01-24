
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function RedirectPage() {
    const router = useRouter();

    const searchParams = useSearchParams();
    useEffect(() => {
        const { query } = router;
        console.log(searchParams.toString());
        console.log(query);
        // Process the query parameters here
        // todo: excahnge code for access token. then route user back to review page to sign the document
        const destination = `/dashboard`;

        // Redirect to the destination page
        router.push(destination);
    }, [router]);

    return null; // This page doesn't render any content
}
