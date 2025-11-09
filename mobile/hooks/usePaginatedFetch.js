import { useState, useEffect } from "react";


export default function usePaginatedFetch(fetcher, deps = []) {
const [page, setPage] = useState(1);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [hasMore, setHasMore] = useState(true);


useEffect(() => {
setData([]); setPage(1); setHasMore(true);
}, deps);


useEffect(() => {
let mounted = true;
const load = async () => {
setLoading(true);
try {
const res = await fetcher(page);
if (!mounted) return;
const items = res.showcases || res.data || [];
setData((p) => page === 1 ? items : [...p, ...items]);
setHasMore(items.length > 0 && (res.totalPages ? page < res.totalPages : true));
} catch (err) {
console.log(err);
} finally { if (mounted) setLoading(false); }
};
load();
return () => { mounted = false; };
}, [page]);


return { data, loading, page, setPage, hasMore };
}