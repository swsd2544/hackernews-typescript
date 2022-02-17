import { extendType, idArg, nonNull, objectType, stringArg } from 'nexus';

export const Link = objectType({
	name: 'Link',
	definition(t) {
		t.nonNull.int('id');
		t.nonNull.string('description');
		t.nonNull.string('url');
	},
});

export const LinkQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.nonNull.field('feed', {
			type: 'Link',
			resolve(parent, args, context, info) {
				return context.prisma.link.findMany();
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

				const createdLink = context.prisma.link.create({
					data: {
						description,
						url,
					},
				});
				return createdLink;
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

				const updatedLink = context.prisma.link.update({
					where: {
						id: +id,
					},
					data: {
						url: url || undefined,
						description: description || undefined,
					},
				});
				return updatedLink;
			},
		});
		t.nonNull.field('deleteLink', {
			type: 'Link',
			args: {
				id: nonNull(idArg()),
			},
			resolve(parent, args, context, info) {
				const { id } = args;

				const deletedLink = context.prisma.link.delete({
					where: {
						id: +id,
					},
				});
				return deletedLink;
			},
		});
	},
});
