import { NexusGenObjects } from './../../nexus-typegen';
import { extendType, idArg, nonNull, objectType, stringArg } from 'nexus';

export const Link = objectType({
	name: 'Link',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('description');
		t.nonNull.string('url');
	},
});

let links: NexusGenObjects['Link'][] = [
	{
		id: 1,
		url: 'www.howtographql.com',
		description: 'Fullstack tutorial for GraphQL',
	},
	{
		id: 2,
		url: 'graphql.org',
		description: 'GraphQL official website',
	},
];

export const LinkQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.nonNull.field('feed', {
			type: 'Link',
			resolve(parent, args, context, info) {
				return links;
			},
		});
	},
});

export const LinkMutation = extendType({
	type: 'Mutation',
	definition(t) {
		t.nonNull.field('post', {
			type: 'Link',
			args: {
				description: nonNull(stringArg()),
				url: nonNull(stringArg()),
			},
			resolve(parent, args, context, info) {
				const { description, url } = args;

				let idCount = links.length + 1;
				const link = {
					id: idCount,
					description,
					url,
				};
				links.push(link);
				return link;
			},
		});
		t.nonNull.field('updateLink', {
			type: 'Link',
			args: {
				id: nonNull(idArg()),
				url: stringArg(),
				description: stringArg(),
			},
			resolve(parent, args, context, info) {
				const { id, url, description } = args;

				const linkIndex = links.findIndex((link) => link.id === +id);
				if (linkIndex === -1) throw new Error(`ID=${id} not found`);

				if (url) links[linkIndex].url = url;
				if (description) links[linkIndex].description = description;
				return links[linkIndex];
			},
		});
		t.nonNull.field('deleteLink', {
			type: 'Link',
			args: {
				id: nonNull(idArg()),
			},
			resolve(parent, args, context, info) {
				const { id } = args;

				const linkIndex = links.findIndex((link) => link.id === +id);
				if (linkIndex === -1) throw new Error(`ID=${id} not found`);

				return links.splice(linkIndex, 1)[0];
			},
		});
	},
});
