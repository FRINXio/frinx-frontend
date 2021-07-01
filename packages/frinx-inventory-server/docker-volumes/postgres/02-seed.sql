\c "frinx";

COPY public.tenants (id, name) FROM stdin;
1	tenant1
2	tenant2
3	tenant3
\.
SELECT pg_catalog.setval('public.tenants_id_seq', 3, true);

COPY public.uniconfig_zones (id, name, tenant) FROM stdin;
1	zone1	1
2	zone2	2
3	zone3	3
\.
SELECT pg_catalog.setval('public.uniconfig_zones_id_seq', 3, true);

COPY public.device_inventory (id, name, uniconfig_zone, role, management_ip, model, sw, sw_version, vendor, mount_parameters, username, password) FROM stdin;
1	mnd-gt0002-cpe4.test	1	l2-cpe	1.2.3.4	3930	saos	6	ciena	{"protocol": "ssh", "port": "22", "parsing-engine": "one-line-parser"}	admin	admin
\.
SELECT pg_catalog.setval('public.uniconfig_zones_id_seq', 1, true);
